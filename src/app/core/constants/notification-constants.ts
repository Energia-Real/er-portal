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
  GLOBAL_DENIED_ACCESS: 'Information Cannot Be Displayed',
  GLOBAL_UNAVAILABLE_ACCESS: 'Module Unavailable',

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

  //Corporate Name
  ADD_CORPORATE_NAME_TITLE: 'Add new corporate',
  ADD_CORPORATE_NAME_CONTENT: 'Please review the data carefully before saving.',
  ADD_CORPORATE_NAME_WARN: 'Some details, like the name and RFC, cannot be modified after saving.',
  ADD_CORPORATE_NAME_COMPLETE_TITLE: 'Corporate Name added',
  ADD_CORPORATE_SUCCESS:'Add_Corporate_Success',
  ADD_CORPORATE_NAME_COMPLETE_CONTENT: 'A new corporate name has been successfully added',
  CANCEL_ADD_CORPORATE_NAME_TITLE: 'Cancel new corporate',
  CANCEL_ADD_CORPORATE_NAME_CONTENT: 'Are you sure you want to cancel adding this corporate? All entered information will be lost, and no changes will be saved',
  EDIT_CORPORATE_SUCCESS: 'Edit_Corporate_Success',


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


  // ALERTS  

  // UNAVAILABLE
  ALERT_UNAVAILABLE_CONTENT: 'This module is currently unavailable. Please try again later',
  ALERT_UNAVAILABLE_WARM: 'If you believe this is an error, contact your administrator for assistance',

  //NO CLIENT ID
  ALERT_NON_CLIENTID_CONTENT: 'This information is unavailable because you do not have a Client ID assigned. Please contact your administrator to request one.',
  ALERT_NON_CLIENTID_WARM: 'Without a Client ID, you cannot access or view this data.',
  
  //LOGIN CREDENTIALS FAILS
  ALERT_NON_LOGIN_CREDENTIALS_TITLE: 'Error',
  ALERT_NON_LOGIN_CREDENTIALS_CONTENT: 'The credentials entered are incorrect. Please check your username and password.',
  ALERT_NON_LOGIN_CREDENTIALS_WARM: 'If the issue persists, try resetting your password or contact your administrator.',

  //MENSAJES CONSTANTES DE NOTIFICACIONES (NO SE CUIENTA CON LAS RESPUIESTAS DE ERROR YA QUE SON SERVICIOS EXTERNOS COMO TOMORROW io) 
  ERROR_TITLE_WEATHER_DATA : 'Data not foud',
  ERROR_CONTENT_WEATHER_DATA : 'Error loading Weather data',

  ERROR_TITLE_TIME_ZONE : 'Data not foud',
  ERROR_CONTENT_TIME_ZONE : 'Error loading Time Zone Place',
};
