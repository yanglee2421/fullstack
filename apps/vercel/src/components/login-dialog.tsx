import { Button } from "@/components/ui/button";
import { Field, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { saveAction } from "@/server/auth";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CircleX, Loader, Save } from "lucide-react";
import React from "react";
import { z } from "zod";
import { ButtonGroup } from "./ui/button-group";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { toast } from "./ui/toast";

const schema = z.object({
  accessToken: z.string().nonempty(),
});

export const LoginDialog = (props: React.PropsWithChildren) => {
  const formId = React.useId();

  const queryClient = useQueryClient();

  const submit = useMutation({
    mutationFn: async (accessToken: string) => {
      await saveAction(accessToken);
    },
    onError: (error) => {
      toast.add({ type: "error", description: error.message });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["overtimes"] });
      toast.add({ type: "success", description: "Successfully!" });
    },
  });

  const form = useForm({
    defaultValues: {
      accessToken: "",
    },
    onSubmit: async ({ value }) => {
      await submit.mutateAsync(value.accessToken);
    },
    validators: {
      onChange: schema,
    },
  });

  return (
    <Dialog>
      {props.children}
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share link</DialogTitle>
          <DialogDescription>
            Anyone who has this link will be able to view this.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-2">
          <div className="grid flex-1 gap-2">
            <form
              id={formId}
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
              }}
              onReset={() => {
                form.reset();
              }}
              noValidate
            >
              <form.Field name="accessToken">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;

                  return (
                    <Field data-invalid={isInvalid}>
                      <ButtonGroup className="w-full">
                        <Input
                          value={field.state.value}
                          onChange={(e) => {
                            field.handleChange(e.target.value);
                          }}
                          onBlur={field.handleBlur}
                          aria-invalid={isInvalid}
                          name={field.name}
                          type="text"
                        />
                        <Button
                          onClick={() => {
                            form.setFieldValue(
                              "accessToken",
                              crypto.randomUUID(),
                            );
                          }}
                          type="button"
                          variant="outline"
                        >
                          generate
                        </Button>
                      </ButtonGroup>
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              </form.Field>
            </form>
          </div>
        </div>
        <DialogFooter className="flex-col sm:justify-end">
          <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting]}>
            {([canSubmit, isSubmitting]) => (
              <Button type="submit" form={formId} disabled={!canSubmit}>
                {isSubmitting ? <Loader className="animate-spin" /> : <Save />}
                Confirm
              </Button>
            )}
          </form.Subscribe>
          <DialogClose
            render={
              <Button type="button" variant={"secondary"}>
                <CircleX />
                Cancel
              </Button>
            }
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
