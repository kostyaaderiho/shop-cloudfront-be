export const mockClient = (data, delay = 100) => ({
    query: jest.fn(
        () =>
            new Promise((resolve) =>
                setTimeout(
                    () =>
                        resolve({
                            rows: data
                        }),
                    delay
                )
            )
    )
});
