export const basicFilterFields = [
    { label: "Customer Name", type: 'autocomplete' },
    { label: "Assignment Status", type: 'select', options: ['Assigned', 'Unassigned'] },
    { label: "Tech Account Name", type: 'autocomplete' }
];

export const advancedFilterFields = [
    { label: "Number Range From", type: 'text' },
    { label: "Number Range To", type: 'text' },
    { label: "Start Date", type: 'date' },
    { label: "End Date", type: 'date' },
    { label: "Tech Account Status", type: 'select', options: ['Active', 'Deleted'] },
    { label: "Service Detail", type: 'text' },
    { label: "Comment", type: 'text' }
];