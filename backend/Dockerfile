# Use official Python image
FROM python:3.12

# Set working directory inside container
WORKDIR /app

# Copy files to container
COPY . .

# Install dependencies
RUN pip install -r requirements.txt

# Expose the port (optional but good for documentation)
EXPOSE 5000

# Run the app
CMD ["python", "app.py"]
