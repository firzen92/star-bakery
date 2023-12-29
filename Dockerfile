FROM node:14.16.0 as builder

# Set the working directory to /app
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the current directory contents into the container at /app
COPY . .

# Build your Angular app
RUN npm run build

# Use a smaller base image for the production environment
FROM nginx:alpine

# Copy the built Angular app to the nginx public directory
COPY --from=builder /app/dist/your-angular-app /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Command to run nginx
CMD ["nginx", "-g", "daemon off;"]
