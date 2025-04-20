/**
 * Interface representing a `Table` entity.
 * This interface defines the structure of a table object used in the application.
 */
export interface Table {
  /**
   * Unique identifier for the table.
   * This field is optional as it may not be present for new tables before they are persisted.
   */
  id?: number;

  /**
   * The number or identifier of the table.
   * Can be a string or a number, depending on the context or system requirements.
   */
  tableNumber: string | number;

  /**
   * The seating capacity of the table.
   * Represents the maximum number of people the table can accommodate.
   */
  capacity: number;

  /**
   * The location of the table within the venue.
   * This field is optional and can be used to provide additional context, such as "near window" or "outdoor".
   */
  location?: string;
}