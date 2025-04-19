import type { Table } from "../interfaces/Table";
import { API_ENDPOINTS } from "../../../config/api.ts";

export class TableRepository  {
  
  private apiUrl = API_ENDPOINTS.TABLES;

  async getAll(): Promise<Table[]> {
    try {
      const response = await fetch(this.apiUrl);
      if (!response.ok) {
        throw new Error(`Error fetching tables: ${response.statusText}`);
      }
      const responseData = await response.json();
      const tables = responseData.data || [];
      return tables.map((item: any) => this.mapToTable(item));
    } catch (error) {
      console.error('Error fetching tables:', error);
      throw error;
    }
  }

  async getById(id: number): Promise<Table | null> {
    try {
      const response = await fetch(`${this.apiUrl}/${id}`);
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`Error fetching table: ${response.statusText}`);
      }
      const data = await response.json();
      return this.mapToTable(data);
    } catch (error) {
      console.error(`Error fetching table with id ${id}:`, error);
      throw error;
    }
  }

  async create(table: Table): Promise<Table> {
    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(this.mapToDto(table)),
      });
      
      if (!response.ok) {
        throw new Error(`Error creating table: ${response.statusText}`);
      }
      
      const data = await response.json();
      return this.mapToTable(data);
    } catch (error) {
      console.error('Error creating table:', error);
      throw error;
    }
  }

  async update(id: number, table: Table): Promise<Table> {
    try {
      const response = await fetch(`${this.apiUrl}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(this.mapToDto(table)),
      });
      
      if (!response.ok) {
        throw new Error(`Error updating table: ${response.statusText}`);
      }
      
      const data = await response.json();
      return this.mapToTable(data);
    } catch (error) {
      console.error(`Error updating table with id ${id}:`, error);
      throw error;
    }
  }

  async delete(id: number): Promise<void> {
    try {
      const response = await fetch(`${this.apiUrl}/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`Error deleting table: ${response.statusText}`);
      }
    } catch (error) {
      console.error(`Error deleting table with id ${id}:`, error);
      throw error;
    }
  }

  private mapToTable(data: any): Table {
    return {
      id: data.id,
      tableNumber: data.numero_mesa,  
      capacity: data.capacidad,     
      location: data.ubicacion || '', 
    };
  }

  private mapToDto(table: Table): any {
    return {
      id: table.id,
      numero_mesa: table.tableNumber,  
      capacidad: table.capacity,       
      ubicacion: table.location,      
    };
  }
}