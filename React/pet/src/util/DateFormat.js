
export const agoDate = (date, ago) => {
    let agoDate = new Date(date);
    agoDate.setDate(date.getDate() - ago);
    
    return agoDate.toISOString().substring(0,10).split("-").join("");;
};

export function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
}