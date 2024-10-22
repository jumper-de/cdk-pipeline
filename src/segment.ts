import { Construct } from "constructs";
import { Stack } from "aws-cdk-lib";
import { IAction } from "aws-cdk-lib/aws-codepipeline";

import { Artifact } from "./artifact";
import { Pipeline } from "./pipeline";

export interface SegmentProps {
  readonly input?: Artifact | Artifact[];
  readonly output?: Artifact | Artifact[];
}

export abstract class Segment {
  readonly isSource: boolean = false;
  readonly isPipeline: boolean = false;
  readonly dependencies?: Stack[];
  readonly inputs: Artifact[] = [];
  readonly outputs: Artifact[] = [];
  constructor(props: SegmentProps) {
    if (props.input) {
      this.inputs = (
        props.input.constructor.name === "Array" ? props.input : [props.input]
      ) as Artifact[];
      this.inputs.forEach((artifact: Artifact) => {
        artifact.consume(this);
      }, this);
    }
    if (props.output) {
      this.outputs = (
        props.output.constructor.name === "Array"
          ? props.output
          : [props.output]
      ) as Artifact[];
      this.outputs.forEach((artifact: Artifact) => {
        artifact.produce(this);
      }, this);
    }
  }
  abstract construct(scope: Pipeline): SegmentConstructed;
}

export abstract class SegmentConstructed extends Construct {
  readonly name: string = "";
  readonly actions: IAction[] = [];
}