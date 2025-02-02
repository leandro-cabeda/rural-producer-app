export const formatCpfCnpj = (value: string) => {
    
    value = value.replace(/\D/g, "");

    if (!value) return "";

    if (value.length <= 11) {
        
        value = value.substring(0, 11);
        return value
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    } else {
        
        value = value.substring(0, 14);
        return value
            .replace(/(\d{2})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d)/, "$1/$2")
            .replace(/(\d{4})(\d{1,2})$/, "$1-$2");
    }
};


export const validateCpfCnpj = (value: string) => {
    if (!value) return false;

    const onlyNumbers = value.replace(/\D/g, "");
    return onlyNumbers.length === 11 || onlyNumbers.length === 14;
};