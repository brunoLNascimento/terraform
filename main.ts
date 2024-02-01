import { Construct } from "constructs";
import { App, TerraformStack, TerraformOutput } from "cdktf";
import * as fs from "fs";
import { AwsProvider } from "@cdktf/provider-aws/lib/provider";
import { KeyPair } from "@cdktf/provider-aws/lib/key-pair"
import { Instance } from "@cdktf/provider-aws/lib/instance"

class MyStack extends TerraformStack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const pubKey = fs.readFileSync("ec2key.pub", "utf8");

    new AwsProvider(this, "aws", {
      region: "us-west-2",
    });

    const keyPair = new KeyPair(this, "keyPair", {
      keyName: "ec2Key",
      publicKey: pubKey
    });

    const machine = new Instance(this, "machine", {
      ami: "ami-0ecc74eca1d66d8a6",
      instanceType: "t2.micro",
      keyName: keyPair.keyName,
    });

    new TerraformOutput(this, "public_ip", {
      value: machine.publicIp
    });

  }
}

const app = new App();
new MyStack(app, "machine");
app.synth();
