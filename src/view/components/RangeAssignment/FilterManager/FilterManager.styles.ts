export const styles = {
    container: {
        mt: 2,
        p: 3,
        backgroundColor: 'background.paper',
        borderRadius: 2,
        boxShadow: 1,
    },
    sectionTitle: {
        fontWeight: 600,
        mb: 3,
        color: 'primary.main',
        fontSize: '1.2rem',
    },
    countryField: {
        mb: 3,
    },
    filterContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        mb: 3,
    },
    filterRow: {
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        width: '100%',
    },
    buttonContainer: {
        mt: 2,
        display: 'flex',
        gap: 2,
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        pt: 2,
        borderTop: '1px solid',
        borderColor: 'divider',
    },
    autocompleteLoading: {
        position: 'absolute',
        right: 30,
        top: '50%',
        transform: 'translateY(-50%)'
    },
};