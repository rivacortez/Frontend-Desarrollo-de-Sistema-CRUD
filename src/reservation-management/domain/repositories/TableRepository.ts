import type { Table } from "../interfaces/Table";
import { API_ENDPOINTS } from "../../../config/api.ts";

/**
 * `TableRepository` is a repository class responsible for managing CRUD operations
 * for the `Table` entity. It interacts with a REST API to perform these operations.
 */
export class TableRepository {

  /**
   * Base URL for the table-related API endpoints.
   */
  private apiUrl = API_ENDPOINTS.TABLES;

  /**
   * Fetches all tables from the API.
   * @returns {Promise<Table[]>} A promise that resolves to an array of `Table` objects.
   * @throws Will throw an error if the API request fails.
   */
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

  /**
   * Fetches a single table by its ID.
   * @param {number} id - The ID of the table to fetch.
   * @returns {Promise<Table | null>} A promise that resolves to a `Table` object or `null` if not found.
   * @throws Will throw an error if the API request fails for reasons other than a 404.
   */
  async getById(id: number): Promise<Table | null> {
    try {
      const response = await fetch(`${this.apiUrl}/${id}`);
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`Error fetching table: ${response.statusText}`);
      }

      const responseData = await response.json();
      const tableData = responseData.data || responseData;

      if (!tableData) {
        return null;
      }

      return this.mapToTable(tableData);
    } catch (error) {
      console.error(`Error fetching table with id ${id}:`, error);
      throw error;
    }
  }

  /**
   * Creates a new table in the API.
   * @param {Table} table - The table data to create.
   * @returns {Promise<Table>} A promise that resolves to the created `Table` object.
   * @throws Will throw an error if the API request fails.
   */
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

  /**
   * Updates an existing table in the API.
   * @param {number} id - The ID of the table to update.
   * @param {Table} table - The updated table data.
   * @returns {Promise<Table>} A promise that resolves to the updated `Table` object.
   * @throws Will throw an error if the API request fails.
   */
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

  /**
   * Deletes a table from the API.
   * @param {number} id - The ID of the table to delete.
   * @returns {Promise<void>} A promise that resolves when the table is deleted.
   * @throws Will throw an error if the API request fails.
   */
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

  /**
   * Maps raw API data to a `Table` object.
   * @param {any} data - The raw data from the API.
   * @returns {Table} A `Table` object.
   */
  private mapToTable(data: any): Table {
    return {
      id: data.id,
      tableNumber: data.numero_mesa,
      capacity: data.capacidad,
      location: data.ubicacion || '',
    };
  }

  /**
   * Maps a `Table` object to the DTO format expected by the API.
   * @param {Table} table - The `Table` object to map.
   * @returns {any} The DTO representation of the `Table`.
   */
  private mapToDto(table: Table): any {
    return {
      id: table.id,
      numero_mesa: table.tableNumber,
      capacidad: table.capacity,
      ubicacion: table.location,
    };
  }
}