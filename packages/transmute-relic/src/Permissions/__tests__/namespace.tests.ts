// import { Store } from "../../Store";
import { getSetupRBAC } from "../__mocks__/setup";

/**
 * Permissions throws on bad events
 */
describe("Permissions throws on bad events", () => {
  let setup: any;

  beforeAll(async () => {
    setup = await getSetupRBAC();
  });

  it("permissions are cool", async () => {
    let { factory } = setup;

    // console.log(factory)

    expect(true);
  });
});