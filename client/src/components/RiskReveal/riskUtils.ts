export const getRiskColor = (color: 'green' | 'orange' | 'red'): string => {
    if (color === 'green') return '#28a745'
    if (color === 'orange') return '#fd7e14'
    return '#dc3545'
}
