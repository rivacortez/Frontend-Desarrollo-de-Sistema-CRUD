/**
 * Interface representing a `Customer` entity.
 * This interface defines the structure of a customer object used in the application.
 */
export interface Customer {
  /**
   * Unique identifier for the customer.
   * This field is optional as it may not be present for new customers before they are persisted.
   */
  id?: number;

  /**
   * The full name of the customer.
   * This field is required and represents the customer's name.
   */
  name: string;

  /**
   * The email address of the customer.
   * This field is required and should follow a valid email format.
   */
  email: string;

  /**
   * The phone number of the customer.
   * This field is optional and can be used to store the customer's contact number.
   */
  phone?: string;

  /**
   * The physical address of the customer.
   * This field is optional and can be used to store additional location details.
   */
  address?: string;

  /**
   * The timestamp when the customer record was created.
   * This field is optional and typically follows ISO 8601 format (e.g., "YYYY-MM-DDTHH:mm:ssZ").
   */
  created_at?: string;

  /**
   * The timestamp when the customer record was last updated.
   * This field is optional and typically follows ISO 8601 format (e.g., "YYYY-MM-DDTHH:mm:ssZ").
   */
  updated_at?: string;
}