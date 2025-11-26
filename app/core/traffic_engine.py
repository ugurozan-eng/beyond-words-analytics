import random
import json
import os
from typing import Dict, Any, List

# Google Analytics Data API
try:
    from google.analytics.data import BetaAnalyticsDataClient
    from google.analytics.data_v1beta.types import RunReportRequest
    GOOGLE_ANALYTICS_AVAILABLE = True
except ImportError:
    GOOGLE_ANALYTICS_AVAILABLE = False

class TrafficIntelligence:
    def __init__(self, lqs_score: float, settings: Any = None):
        self.lqs_score = lqs_score
        self.settings = settings

    def fetch_real_ga4_data(self) -> Dict[str, Any]:
        """
        Fetches real traffic data from Google Analytics 4.
        """
        if not GOOGLE_ANALYTICS_AVAILABLE:
            raise ImportError("google-analytics-data library is not installed.")

        if not self.settings or not self.settings.ga4_client_secret or not self.settings.ga4_property_id:
            raise ValueError("GA4 settings are missing.")

        # Parse client secret JSON
        try:
            credentials_dict = json.loads(self.settings.ga4_client_secret)
        except json.JSONDecodeError:
            raise ValueError("Invalid GA4 Client Secret JSON.")

        # Create client
        client = BetaAnalyticsDataClient.from_service_account_info(credentials_dict)

        # Run report
        request = RunReportRequest(
            property=f"properties/{self.settings.ga4_property_id}",
            dimensions=[{"name": "sessionDefaultChannelGroup"}],
            metrics=[{"name": "activeUsers"}, {"name": "sessions"}],
            date_ranges=[{"start_date": "30daysAgo", "end_date": "today"}],
        )

        response = client.run_report(request)

        # Process response
        sources = []
        total_visits = 0
        
        # Mapping for colors and names
        mapping = {
            "Organic Search": {"name": "Google Organic", "color": "#4285F4"},
            "Organic Social": {"name": "Pinterest/Social", "color": "#E60023"},
            "Direct": {"name": "Direct", "color": "#9CA3AF"},
            "Referral": {"name": "Referral", "color": "#10B981"},
            "Email": {"name": "Email", "color": "#F59E0B"},
            "Paid Search": {"name": "Paid Ads", "color": "#8B5CF6"},
        }

        for row in response.rows:
            channel_group = row.dimension_values[0].value
            sessions = int(row.metric_values[1].value)
            total_visits += sessions

            mapped = mapping.get(channel_group, {"name": "Other", "color": "#6B7280"})
            
            # Check if source already exists in list (merge Others)
            existing = next((item for item in sources if item["name"] == mapped["name"]), None)
            if existing:
                existing["value"] += sessions
            else:
                sources.append({
                    "name": mapped["name"],
                    "value": sessions,
                    "color": mapped["color"]
                })

        return {
            "total_visits": total_visits,
            "insight": f"Last 30 days data from GA4. Total sessions: {total_visits}",
            "sources": sources
        }

    def generate_mock_data(self) -> Dict[str, Any]:
        """
        Generates mock traffic data based on LQS score.
        """
        base_visits = int(self.lqs_score * 100) + random.randint(50, 500)
        
        # Distribute visits
        google_share = random.uniform(0.3, 0.5)
        etsy_share = random.uniform(0.2, 0.4)
        pinterest_share = random.uniform(0.1, 0.2)
        direct_share = 1.0 - (google_share + etsy_share + pinterest_share)
        
        if direct_share < 0: direct_share = 0.05

        sources = [
            {"name": "Etsy Search", "value": int(base_visits * etsy_share), "color": "#F97316"},
            {"name": "Google Organic", "value": int(base_visits * google_share), "color": "#4285F4"},
            {"name": "Pinterest/Social", "value": int(base_visits * pinterest_share), "color": "#E60023"},
            {"name": "Direct", "value": int(base_visits * direct_share), "color": "#9CA3AF"}
        ]

        return {
            "total_visits": base_visits,
            "insight": "Traffic estimation based on LQS score (Mock Data).",
            "sources": sources
        }

    def generate_data(self) -> Dict[str, Any]:
        """
        Main method to get traffic data. Tries GA4 first, falls back to mock.
        """
        try:
            return self.fetch_real_ga4_data()
        except Exception as e:
            print(f"GA4 Fetch Error: {e}. Falling back to mock data.")
            return self.generate_mock_data()
