import { Button } from "@/components/ui/button";
import { Field, FieldError } from "@/components/ui/field";
import { saveAction } from "@/server/auth";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CircleX, Loader, LogIn, Shuffle, X } from "lucide-react";
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
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "./ui/input-group";
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
          <DialogTitle>Wellcome to Acme Inc.</DialogTitle>
          <DialogDescription>
            Enter any password to log in to the application.
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
                        <InputGroup>
                          <InputGroupInput
                            value={field.state.value}
                            onChange={(e) => {
                              field.handleChange(e.target.value);
                            }}
                            onBlur={field.handleBlur}
                            aria-invalid={isInvalid}
                            name={field.name}
                            type="text"
                          />
                          {!!field.state.value && (
                            <InputGroupAddon align="inline-end">
                              <InputGroupButton
                                onClick={() => {
                                  field.setValue("", { dontValidate: true });
                                }}
                              >
                                <X />
                              </InputGroupButton>
                            </InputGroupAddon>
                          )}
                        </InputGroup>
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
                          <Shuffle />
                          Generate
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
                {isSubmitting ? <Loader className="animate-spin" /> : <LogIn />}
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
