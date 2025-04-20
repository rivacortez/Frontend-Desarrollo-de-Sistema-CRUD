/**
 * Interface representing a `Reservation` entity.
 * This interface defines the structure of a reservation object used in the application.
 */
export interface Reservation {
  /**
   * Unique identifier for the reservation.
   * This field is optional as it may not be present for new reservations before they are persisted.
   */
  id?: number;

  /**
   * The date of the reservation.
   * Expected format is a string, typically in ISO 8601 format (e.g., "YYYY-MM-DD").
   */
  date: string;

  /**
   * The time of the reservation.
   * Expected format is a string, typically in "HH:mm" or "HH:mm:ss" format.
   */
  time: string;

  /**
   * The number of people included in the reservation.
   * Represents the total number of guests for the reservation.
   */
  numberOfPeople: number;

  /**
   * The unique identifier of the customer associated with the reservation.
   * This links the reservation to a specific customer.
   */
  customerId: number;

  /**
   * The unique identifier of the table associated with the reservation.
   * This links the reservation to a specific table.
   */
  tableId: number;

  /**
   * Optional customer details associated with the reservation.
   * Includes the customer's unique identifier and name.
   */
  customer?: {
    /**
     * Unique identifier for the customer.
     */
    id: number;

    /**
     * Name of the customer.
     */
    name: string;
  };

  /**
   * Optional table details associated with the reservation.
   * Includes the table's unique identifier and table number.
   */
  table?: {
    /**
     * Unique identifier for the table.
     */
    id: number;

    /**
     * The number or identifier of the table.
     * Can be a string or a number, depending on the context or system requirements.
     */
    tableNumber: string | number;
  };
}