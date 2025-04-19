import type { Reservation } from "../interfaces/Reservation";
import { API_ENDPOINTS } from "../../../config/api.ts";

export class ReservationRepository {
  private apiUrl = API_ENDPOINTS.RESERVATIONS;

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

  async getById(id: number): Promise<Reservation | null> {
    try {
      if (!navigator.onLine) {
        throw new Error("No internet connection available");
      }

      const response = await fetch(`${this.apiUrl}/${id}`);
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`Error fetching reservation: ${response.statusText}`);
      }
      const data = await response.json();
      return this.mapToReservation(data);
    } catch (error) {
      console.error(`Error fetching reservation with id ${id}:`, error);
      throw error;
    }
  }

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