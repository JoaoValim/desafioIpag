const allowedTransitions = {
    'CANCELED': ["PENDING" , "WAITING_PAYMENT" , "PAID" , "PROCESSING"],
    'METHODS': ["PENDING" , "WAITING_PAYMENT" , "PAID" , "PROCESSING" , "SHIPPED" , "DELIVERED"]
};

export function isValidStatusTransition(currentStatus, newStatus) {
    if (currentStatus === newStatus) {
        return true; 
    }

    if (newStatus === 'CANCELED') {
        return allowedTransitions['CANCELED'].includes(currentStatus);
    }

    let indexCurrent = allowedTransitions['METHODS'].indexOf(currentStatus);
    let indexNew = allowedTransitions['METHODS'].indexOf(newStatus);

    return indexCurrent != -1 && allowedTransitions['METHODS'].includes(newStatus) && indexNew > indexCurrent;
}