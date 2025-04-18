const parseNumber = (number, defaultValue) => {
    const isString = typeof number === 'string';
    if (!isString) return defaultValue;

    const parsedNumber = parseInt(number);
    if (Number.isNaN(parsedNumber)) {
    return defaultValue;
    }

    return parsedNumber;
};

export const parsePaginationParams = (query) => {
    const { page, perPage } = query;

    const parsedPage = parseNumber(page, 1);
    const parsedPerPage = parseNumber(perPage, 10);

    return {
    page: parsedPage,
    perPage: parsedPerPage,
    };
};
