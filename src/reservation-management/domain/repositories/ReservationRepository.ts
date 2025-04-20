import type { Reservation } from "../interfaces/Reservation";
import { API_ENDPOINTS } from "../../../config/api.ts";

/**
 * `ReservationRepository` is a repository class responsible for managing CRUD operations
 * for the `Reservation` entity. It interacts with a REST API to perform these operations.
 */
export class ReservationRepository {
  /**
   * Base URL for the reservation-related API endpoints.
   */
  private apiUrl = API_ENDPOINTS.RESERVATIONS;

  /**
   * Fetches all reservations from the API.
   * @returns {Promise<Reservation[]>} A promise that resolves to an array of `Reservation` objects.
   * @throws Will throw an error if the API request fails or if there is no internet connection.
   */
  async getAll(): Promise<Reservation[]> {
    try {
      if (!navigator.onLine) {
        throw new Error("No internet connection available");
      }

      const response = await fetch(this.apiUrl);
      if (!response.ok) {
        throw new Error(`Error fetching reservations: ${response.statusText}`);
      }

      const result = await response.json();
      const reservationsData = Array.isArray(result) ? result : (result.data || []);
      return reservationsData.map((item: any) => this.mapToReservation(item));
    } catch (error) {
      console.error('Error fetching reservations:', error);
      throw error;
    }
  }

  /**
   * Creates a new reservation in the API.
   * @param {Reservation} reservation - The reservation data to create.
   * @returns {Promise<Reservation>} A promise that resolves to the created `Reservation` object.
   * @throws Will throw an error if the API request fails or if there is no internet connection.
   */
  async create(reservation: Reservation): Promise<Reservation> {
    try {
      if (!navigator.onLine) {
        throw new Error("No internet connection available");
      }

      console.log('Creating reservation at URL:', this.apiUrl);
      console.log('Payload:', this.mapToDto(reservation));

      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(this.mapToDto(reservation)),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error creating reservation (${response.status}): ${response.statusText}. Details: ${errorText}`);
      }

      const data = await response.json();
      return this.mapToReservation(data);
    } catch (error) {
      console.error('Error creating reservation:', error);
      if (error instanceof Error) {
        error.message += ` (API URL: ${this.apiUrl})`;
      }
      throw error;
    }
  }

  /**
   * Updates an existing reservation in the API.
   * @param {number} id - The ID of the reservation to update.
   * @param {Reservation} reservation - The updated reservation data.
   * @returns {Promise<Reservation>} A promise that resolves to the updated `Reservation` object.
   * @throws Will throw an error if the API request fails or if there is no internet connection.
   */
  async update(id: number, reservation: Reservation): Promise<Reservation> {
    try {
      if (!navigator.onLine) {
        throw new Error("No internet connection available");
      }

      const response = await fetch(`${this.apiUrl}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(this.mapToDto(reservation)),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error updating reservation (${response.status}): ${response.statusText}. Details: ${errorText}`);
      }

      const data = await response.json();
      return this.mapToReservation(data);
    } catch (error) {
      console.error(`Error updating reservation with id ${id}:`, error);
      throw error;
    }
  }

  /**
   * Deletes a reservation from the API.
   * @param {number} id - The ID of the reservation to delete.
   * @returns {Promise<void>} A promise that resolves when the reservation is deleted.
   * @throws Will throw an error if the API request fails or if there is no internet connection.
   */
  async delete(id: number): Promise<void> {
    try {
      if (!navigator.onLine) {
        throw new Error("No internet connection available");
      }

      const response = await fetch(`${this.apiUrl}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error deleting reservation (${response.status}): ${response.statusText}. Details: ${errorText}`);
      }
    } catch (error) {
      console.error(`Error deleting reservation with id ${id}:`, error);
      throw error;
    }
  }

  /**
   * Maps raw API data to a `Reservation` object.
   * @param {any} data - The raw data from the API.
   * @returns {Reservation} A `Reservation` object.
   */
  private mapToReservation(data: any): Reservation {
    if (!data) return null as unknown as Reservation;

    const tableId = data.mesa_id || data.table_id || null;
    const tableData = data.mesa || data.table || null;

    let tableInfo = undefined;
    if (tableData) {
      tableInfo = {
        id: tableData.id,
        tableNumber: tableData.numero_mesa || tableData.table_number || tableData.tableNumber || '-'
      };
    } else if (tableId) {
      tableInfo = { id: tableId, tableNumber: `Mesa #${tableId}` };
    }

    const customerData = data.comensal || data.customer;
    const customerInfo = customerData ? {
      id: customerData.id,
      name: customerData.nombre || customerData.name || ''
    } : undefined;

    return {
      id: data.id,
      date: data.fecha || data.date || '',
      time: data.hora || data.time || '',
      numberOfPeople: data.numero_de_personas || data.number_of_people || 0,
      customerId: data.comensal_id || data.customer_id || null,
      tableId: tableId,
      customer: customerInfo,
      table: tableInfo
    };
  }

  /**
   * Maps a `Reservation` object to the DTO format expected by the API.
   * @param {Reservation} reservation - The `Reservation` object to map.
   * @returns {any} The DTO representation of the `Reservation`.
   */
  private mapToDto(reservation: Reservation): any {
    let formattedTime = reservation.time;
    if (formattedTime && !formattedTime.includes(':')) {
      formattedTime = `${formattedTime}:00:00`;
    } else if (formattedTime && formattedTime.split(':').length === 2) {
      formattedTime = `${formattedTime}:00`;
    }

    return {
      id: reservation.id,
      fecha: reservation.date,
      hora: formattedTime,
      numero_de_personas: reservation.numberOfPeople,
      comensal_id: reservation.customerId,
      mesa_id: reservation.tableId
    };
  }
}