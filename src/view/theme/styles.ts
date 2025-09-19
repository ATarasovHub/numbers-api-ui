export const styles = {
    inactiveCell: {
        color: '#9e9e9e',
        backgroundColor: '#f5f5f5',
        cursor: 'default',
        userSelect: 'none',
        opacity: 0.7,
        '&:hover': {
            backgroundColor: '#f5f5f5',
        }
    },
    activeField: {
        '& .MuiInputBase-root': {
            backgroundColor: '#fafafa',
        },
        '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#bdbdbd',
        },
        '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#9e9e9e',
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#757575',
        },
    },
    inactiveSelect: {
        '& .MuiSelect-select': {
            backgroundColor: '#f5f5f5',
            color: '#9e9e9e',
        },
        '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#e0e0e0',
        },
        '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#e0e0e0',
        },
    },
    mainContainer: {
        p: 3,
        maxWidth: 1200,
        m: '40px auto',
        borderRadius: 2
    },
    title: {
        mb: 2,
        fontWeight: 700
    },
    sectionTitle: {
        fontWeight: 600
    },
    filterRow: {
        display: 'flex',
        alignItems: 'center',
        gap: 1
    },
    filterContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: 2
    },
    buttonContainer: {
        mt: 2,
        display: 'flex',
        gap: 1
    },
    tableContainer: {
        p: 2,
        mt: 3,
        width: '100%'
    },
    tableHeader: {
        backgroundColor: '#e6f7ff'
    },
    tableHeaderCell: {
        fontWeight: '600',
        fontSize: '0.8rem'
    },
    tableRow: {
        '&:nth-of-type(odd)': {
            backgroundColor: '#f9f9f9'
        }
    },
    loadingContainer: {
        display: 'flex',
        justifyContent: 'center',
        p: 3
    },
    scrollContainer: {
        maxHeight: 400,
        overflowY: 'auto'
    },
    loadMoreContainer: {
        display: 'flex',
        justifyContent: 'center',
        p: 2
    },
    autocompleteLoading: {
        position: 'absolute',
        right: 30,
        top: '50%',
        transform: 'translateY(-50%)'
    }
};
