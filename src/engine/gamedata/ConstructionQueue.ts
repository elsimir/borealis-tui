import type { Colony } from "./Colony.js";
import { GameData } from "../GameData.js";

export type ConstructionStatus =
  | { status: "Ok" }
  | { status: "QueueEmpty" }
  | { status: "InsufficientResources" }
  | { status: "BuildingCompleted"; queueEmpty: boolean };

export interface ConstructionQueueItem {
  installationId: string;
  count: number;
  remainingCost: number;
}

export class ConstructionQueue {
  private items: ConstructionQueueItem[] = [];

  constructor(private colony: Colony) {}

  add(installationId: string, count: number, costPerBuilding: number): void {
    this.items.push({ installationId, count, remainingCost: costPerBuilding });
  }

  remove(index: number): void {
    this.items.splice(index, 1);
  }

  reorder(fromIndex: number, toIndex: number): void {
    if (fromIndex === toIndex) return;
    const [item] = this.items.splice(fromIndex, 1);
    this.items.splice(toIndex, 0, item!);
  }

  getFirst(): ConstructionQueueItem | undefined {
    return this.items[0];
  }

  all(): readonly ConstructionQueueItem[] {
    return this.items;
  }

  get length(): number {
    return this.items.length;
  }

  applyPoints(buildPoints: number): ConstructionStatus {
    const { stockpile, installations } = this.colony;
    let remaining = buildPoints;
    let buildingCompleted = false;

    while (remaining > 0 && this.items.length > 0) {
      const item = this.items[0]!;
      const installation = GameData.instance.installations.byId(item.installationId);
      const costPerBuilding = installation?.cost.build_points ?? item.remainingCost;

      const pointsApplied = Math.min(remaining, item.remainingCost);
      const fraction = pointsApplied / costPerBuilding;

      if (installation) {
        const canAfford = Object.entries(installation.cost.resources).every(
          ([resourceId, amount]) => (stockpile[resourceId] ?? 0) >= amount * fraction
        );
        if (!canAfford) return { status: "InsufficientResources" };

        for (const [resourceId, amount] of Object.entries(installation.cost.resources)) {
          stockpile[resourceId] = (stockpile[resourceId] ?? 0) - amount * fraction;
        }
      }

      item.remainingCost -= pointsApplied;
      remaining -= pointsApplied;

      if (item.remainingCost <= 0) {
        installations[item.installationId] = (installations[item.installationId] ?? 0) + 1;
        item.count -= 1;
        buildingCompleted = true;

        if (item.count <= 0) {
          this.items.shift();
        } else {
          item.remainingCost = costPerBuilding;
        }
      }
    }

    if (buildingCompleted) {
      return { status: "BuildingCompleted", queueEmpty: this.items.length === 0 };
    }

    return { status: "Ok" };
  }
}
