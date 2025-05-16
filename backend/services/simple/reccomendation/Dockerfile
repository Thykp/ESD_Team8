# Use Python base image
FROM python:3.13.2-slim-bookworm

# Set working directory
WORKDIR /app

# Install system dependencies needed for building Python native modules
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Rust (needed for pydantic-core and others)
RUN curl https://sh.rustup.rs -sSf | sh -s -- -y
ENV PATH="/root/.cargo/bin:${PATH}"

# Copy Python dependencies first
COPY requirements.txt ./

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of your application code
COPY . .

# Expose FastAPI port
EXPOSE 4000

# Command to run app
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "4000"]
