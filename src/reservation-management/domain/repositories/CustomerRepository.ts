import type { Customer } from '../interfaces/Customer';
import { API_ENDPOINTS } from "../../../config/api.ts";

/**
 * `CustomerRepository` is a repository class responsible for managing CRUD operations
 * for the `Customer` entity. It interacts with a REST API to perform these operations.
 */
export class CustomerRepository {

  /**
   * Base URL for the customer-related API endpoints.
   */
  private apiUrl = API_ENDPOINTS.CUSTOMERS;

  /**
   * Fetches all customers from the API.
   * @returns {Promise<Customer[]>} A promise that resolves to an array of `Customer` objects.
   * @throws Will throw an error if the API request fails.
   */
  async getAll(): Promise<Customer[]> {
    try {
      const response = await fetch(this.apiUrl);
      if (!response.ok) {
        throw new Error(`Error fetching customers: ${response.statusText}`);
      }
      const responseData = await response.json();
      const customers = responseData.data || [];
      return customers.map((item: any) => this.mapToCustomer(item));
    } catch (error) {
      console.error('Error fetching customers:', error);
      throw error;
    }
  }

  /**
   * Fetches a single customer by their ID.
   * @param {number} id - The ID of the customer to fetch.
   * @returns {Promise<Customer | null>} A promise that resolves to a `Customer` object or `null` if not found.
   * @throws Will throw an error if the API request fails for reasons other than a 404.
   */
  async getById(id: number): Promise<Customer | null> {
    try {
      const response = await fetch(`${this.apiUrl}/${id}`);
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`Error fetching customer: ${response.statusText}`);
      }
      const data = await response.json();
      return this.mapToCustomer(data);
    } catch (error) {
      console.error(`Error fetching customer with id ${id}:`, error);
      throw error;
    }
  }

  /**
   * Creates a new customer in the API.
   * @param {Customer} customer - The customer data to create.
   * @returns {Promise<Customer>} A promise that resolves to the created `Customer` object.
   * @throws Will throw an error if the API request fails.
   */
  async create(customer: Customer): Promise<Customer> {
    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(this.mapToDto(customer)),
      });

      if (!response.ok) {
        throw new Error(`Error creating customer: ${response.statusText}`);
      }

      const data = await response.json();
      return this.mapToCustomer(data);
    } catch (error) {
      console.error('Error creating customer:', error);
      throw error;
    }
  }

  /**
   * Updates an existing customer in the API.
   * @param {number} id - The ID of the customer to update.
   * @param {Customer} customer - The updated customer data.
   * @returns {Promise<Customer>} A promise that resolves to the updated `Customer` object.
   * @throws Will throw an error if the API request fails.
   */
  async update(id: number, customer: Customer): Promise<Customer> {
    try {
      const response = await fetch(`${this.apiUrl}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(this.mapToDto(customer)),
      });

      if (!response.ok) {
        throw new Error(`Error updating customer: ${response.statusText}`);
      }

      const data = await response.json();
      return this.mapToCustomer(data);
    } catch (error) {
      console.error(`Error updating customer with id ${id}:`, error);
      throw error;
    }
  }

  /**
   * Deletes a customer from the API.
   * @param {number} id - The ID of the customer to delete.
   * @returns {Promise<void>} A promise that resolves when the customer is deleted.
   * @throws Will throw an error if the API request fails.
   */
  async delete(id: number): Promise<void> {
    try {
      const response = await fetch(`${this.apiUrl}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Error deleting customer: ${response.statusText}`);
      }
    } catch (error) {
      console.error(`Error deleting customer with id ${id}:`, error);
      throw error;
    }
  }

  /**
   * Maps raw API data to a `Customer` object.
   * @param {any} data - The raw data from the API.
   * @returns {Customer} A `Customer` object.
   */
  private mapToCustomer(data: any): Customer {
    return {
      id: data.id,
      name: data.nombre,
      email: data.correo,
      phone: data.telefono,
      address: data.direccion,
      created_at: data.created_at,
      updated_at: data.updated_at
    };
  }

  /**
   * Maps a `Customer` object to the DTO format expected by the API.
   * @param {Customer} customer - The `Customer` object to map.
   * @returns {any} The DTO representation of the `Customer`.
   */
  private mapToDto(customer: Customer): any {
    return {
      id: customer.id,
      nombre: customer.name,
      correo: customer.email,
      telefono: customer.phone,
      direccion: customer.address,
      created_at: customer.created_at,
      updated_at: customer.updated_at
    };
  }
}