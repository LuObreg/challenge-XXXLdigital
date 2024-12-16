import { readAppConfiguration } from "../source/models/ConfigurationModel.js";
import createApp from "../source/server.js";

jest.mock("../source/models/ConfigurationModel.js");
jest.mock("../source/server.js");

describe("Server initialization", () => {
  const mockConfig = {
    port: 3000,
    expressServerOptions: {
      keepAliveTimeout: 5000,
      maxHeadersCount: 100,
      timeout: 120000,
      maxConnections: 50,
      headersTimeout: 10000,
      requestTimeout: 3000,
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (readAppConfiguration as jest.Mock).mockReturnValue(mockConfig);
    (createApp as jest.Mock).mockReturnValue({
      app: {
        listen: jest.fn((port, callback) => {
          callback();
          return {
            keepAliveTimeout: 0,
            maxHeadersCount: 0,
            maxConnections: 0,
            headersTimeout: 0,
            requestTimeout: 0,
            timeout: 0,
          };
        }),
      },
    });
  });

  it("should read the configuration file", () => {
    require("../source/app.js");
    expect(readAppConfiguration).toHaveBeenCalledWith("./config.json");
  });

  xit("should start the server with the correct port", () => {
    const consoleSpy = jest.spyOn(console, "log").mockImplementation();
   require("../source/app.js");
    expect(consoleSpy).toHaveBeenCalledWith({
      description: "START",
      port: mockConfig.port,
    });
    consoleSpy.mockRestore();
  });
});
