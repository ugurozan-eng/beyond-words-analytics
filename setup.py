from setuptools import setup, find_packages

setup(
    name="beyond-words-analytics",
    version="1.0.0",
    packages=find_packages(),
    install_requires=[
        "fastapi",
        "uvicorn[standard]",
        "sqlalchemy",
        "pydantic",
        "pydantic-settings",
        "psycopg[binary]",
        "httpx",
        "python-multipart",
        "google-analytics-data",
        "python-dotenv",
        "requests",
        "email-validator",
        "typing-extensions",
        "gunicorn",
        "google-generativeai"
    ],
)
