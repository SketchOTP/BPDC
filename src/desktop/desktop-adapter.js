/**
 * Host-neutral seam between CreatureCore intentions and a desktop body.
 * Implementations translate, observe, and shut down. They do not select
 * behavior or mutate CreatureCore state.
 */
export class DesktopAdapter {
  async execute(_intent) {
    throw new Error("DesktopAdapter.execute() must be implemented by a host adapter.");
  }

  async getExecutionState() {
    throw new Error("DesktopAdapter.getExecutionState() must be implemented by a host adapter.");
  }

  async shutdown() {}
}
