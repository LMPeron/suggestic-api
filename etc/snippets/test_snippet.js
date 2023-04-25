const snippet = `
/**
 * @jest-environment node
 */
jest.setTimeout(60000);
global.console = {
    log: jest.fn(),
    error: jest.fn()
}
`;

module.exports = snippet;
