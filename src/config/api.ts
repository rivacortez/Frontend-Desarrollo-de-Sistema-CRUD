/**
 * Configuration file for API endpoints.
 * This file defines the base URL for the API and the specific endpoints for various resources.
 * It is used throughout the application to standardize API calls and ensure consistency.
 */

const API_BASE_URL = 'http://127.0.0.1:8000/api';

/**
 * Object containing the endpoints for different resources in the API.
 * Each property represents a specific resource and its corresponding endpoint.
 */
export const API_ENDPOINTS = {
  /**
   * Endpoint for managing table-related operations.
   * Example: `${API_BASE_URL}/tables`
   */
  TABLES: `${API_BASE_URL}/tables`,

  /**
   * Endpoint for managing customer-related operations.
   * Example: `${API_BASE_URL}/customers`
   */
  CUSTOMERS: `${API_BASE_URL}/customers`,

  /**
   * Endpoint for managing reservation-related operations.
   * Example: `${API_BASE_URL}/reservations`
   */
  RESERVATIONS: `${API_BASE_URL}/reservations`
};