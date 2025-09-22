export const editCountryStatsFormStyles = {
    modalBox: {
        position: 'absolute' as const,
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        borderRadius: 2,
        minWidth: 320
    },
    title: {
        mb: 2
    },
    textField: {
        fullWidth: true,
        margin: 'normal'
    },
    buttonContainer: {
        mt: 2,
        display: 'flex',
        justifyContent: 'flex-end',
        gap: 1
    }
};