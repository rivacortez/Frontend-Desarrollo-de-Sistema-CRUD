import type { Customer } from '../interfaces/Customer';
import { API_ENDPOINTS } from "../../../config/api.ts";

export class CustomerRepository {

  private apiUrl = API_ENDPOINTS.CUSTOMERS;

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