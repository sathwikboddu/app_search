# Use official Python image
FROM python:3.10

# Set the working directory inside the container
WORKDIR /

# Copy only the requirements file first (for caching)
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 8000

# Start the Django server
CMD python manage.py migrate && python manage.py runserver 0.0.0.0:8000
