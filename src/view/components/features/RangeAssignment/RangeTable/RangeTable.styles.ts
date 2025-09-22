export const styles = {
    container: {
        mt: 3,
        p: 2,
        backgroundColor: 'background.paper',
        borderRadius: 2,
        boxShadow: 1,
    },
    title: {
        fontWeight: 600,
        mb: 2,
        color: 'primary.main',
        fontSize: '1.2rem',
    },
    loadingContainer: {
        display: 'flex',
        justifyContent: 'center',
        p: 4,
    },
    scrollContainer: {
        maxHeight: 500,
        overflowY: 'auto',
        borderRadius: 1,
        border: '1px solid',
        borderColor: 'divider',
    },
    tableHeader: {
        backgroundColor: 'primary.light',
    },
    tableHeaderCell: {
        fontWeight: '600',
        fontSize: '0.85rem',
        color: 'primary.main',
        py: 1.5,
    },
    tableRow: {
        '&:nth-of-type(odd)': {
            backgroundColor: 'grey.50',
        },
        '&:hover': {
            backgroundColor: 'grey.100',
        }
    },
    loadMoreContainer: {
        display: 'flex',
        justifyContent: 'center',
        p: 2,
    },
    noMoreData: {
        textAlign: 'center',
        p: 3,
        color: 'text.secondary',
        fontStyle: 'italic',
    },
};