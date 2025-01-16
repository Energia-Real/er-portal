export const NOTIFICATION_CONSTANTS = {
  ADD: 'add',
  EDIT: 'edit',
  DELETE: 'delete',
  ERRORS: 'Error',

  //Data for Notification types
  EDIT_CONFIRM_TYPE: 'Edit_Confirm',
  ADD_CONFIRM_TYPE: 'Add_Confirm',
  DELETE_CONFIRM_TYPE: 'Delete_Confirm',
  REMINDER_TYPE: 'Reminder',
  WARNING_TYPE: 'Warning',
  INFORMATION_TYPE: 'Information',
  CANCEL_TYPE: 'Cancel',
  ERROR_TYPE: 'Error_Notification',


  //Data for notification statuses
  CANCELED_STATUS: 'Canceled',
  FAILED_STATUS: 'Failed',
  COMPLETED_STATUS: 'Completed',
  PENDING_STATUS: 'Pending',
  INPROGRESS_STATUS: 'In Progress',
  SCHELUDED_STATUS: 'Scheduled',

  //Data for notifications
  ACTION_BUTTON: 'Confirm',
  GLOBAL_DELETE_TITLE: 'Delete Confirmation',
  GLOBAL_DELETE_CONTENT: 'Are you sure you want to delete this (item)? This action is irreversible and will remove all related information, including plants and records. Please confirm before proceeding.',
  GLOBAL_DELETE_WARN: '',
  GLOBAL_EDIT_TITLE: 'Save the changes',
  GLOBAL_EDIT_CONTENT: 'Are you sure you want to save the changes? ',
  GLOBAL_EDIT_WARN: 'Once this action is performed, it cannot be undone.',

  // Clients 
  ADD_CLIENT_TITLE: 'Add new client',
  ADD_CLIENT_CONTENT: 'Please review the data carefully before saving.',
  ADD_CLIENT_WARN: 'Fields like the start date and ID cannot be edited once saved.',
  ADD_CLIENT_COMPLETE_TITLE: 'Client added',
  ADD_CLIENT_COMPLETE_CONTENT: 'A new client has been successfully added.',
  EDIT_CLIENT_COMPLETE_TITLE: 'Changes saved',
  EDIT_CLIENT_COMPLETE_CONTENT: 'Your data has been successfully saved.',
  CANCEL_ADD_CLIENT_TITLE: 'Cancel new client',
  CANCEL_ADD_CLIENT_CONTENT: 'Are you sure you want to cancel adding this company? All entered information will be lost, and no changes will be saved',

  // Invoices 
  GENERATE_INVOICE_TITLE: 'Confirm Invoice Generation',
  GENERATE_INVOICE_CONTENT: 'You are about to generate invoices for the selected period.',
  GENERATE_INVOICE_WARN: 'This action will finalize the incoices for this period and cannot be undone. Do you want to procced?',

  CONFIRM_INVOICE_TITLE: 'Confirm Changes',
  CONFIRM_INVOICE_CONTENT: 'Are you sure you want to apply these changes? Please remember that this action directly affects the presented data and is irreversible once executed.',
  CONFIRM_INVOICE_WARN: 'Attention! This action cannot be undone',
  //Data for Center Notification Messages (Only message keys) 

  //Clients
  ADD_CLIENT_SUCCESS: 'Add_Client_Success',
  ADD_CLIENT_ERROR: 'Add_Client_Error',
  EDIT_CLIENT_SUCCESS: 'Edit_Client_Success',
  EDIT_CLIENT_ERROR: 'Edit_Client_Error',
  DELETE_CLIENT_SUCCESS: 'Delete_Client_Success',
  DELETE_CLIENT_ERROR: 'Delete_Client_Error',


  // Errors
  ERRORS_INVOICE_TITLE: 'Multiple Errors Detected',
  ERROR_INVOICE_TITLE: 'Error Detected',
  ERRORS_INVOICE_CONTENT: 'Several errors were found during the process. Please review the follwing details and address them accodingly:',
  ERROR_INVOICE_CONTENT: 'Several error were found during the process. Please review the follwing details and address them accodingly:',


  //Generals
  ADD_GENERAL_ERROR: 'Add_General_Error',
  EDIT_GENERAL_ERROR: 'Edit_General_Error',


};
