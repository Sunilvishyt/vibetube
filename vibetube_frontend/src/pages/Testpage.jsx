import React from "react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import MoreButton from "@/components/my_components/MoreButton";
function Testpage() {
  return (
    <div>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline">Open</Button>
        </SheetTrigger>
        <SheetContent>
          <div className="grid flex-1 auto-rows-min gap-6 px-4">
            <div className="grid gap-3">
              <Label htmlFor="sheet-demo-name">Name</Label>
              <Input id="sheet-demo-name" defaultValue="Pedro Duarte" />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="sheet-demo-username">Username</Label>
              <Input id="sheet-demo-username" defaultValue="@peduarte" />
            </div>
          </div>

          <SheetClose asChild>
            <Button variant="outline">Close</Button>
          </SheetClose>
        </SheetContent>
      </Sheet>
      <h1>Welcome to our test page</h1>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid autem
        odit, soluta sint explicabo, obcaecati voluptatum maiores aliquam quos
        molestiae officiis modi corrupti! Molestiae ipsa minima ullam dicta ab
        repudiandae?
      </p>
      <MoreButton />
    </div>
  );
}

export default Testpage;
