import { z } from "zod";

export const UserSchema = z.object({
     id: z.string().uuid(),
     email: z.string().email(),
     name: z.string(),
     password: z
          .string()
          .min(8, "A jelszónak legalább 8 karakter hosszúnak kell lennie.")
          .regex(/[A-Z]/, "Tartalmaznia kell legalább egy nagybetűt.")
          .regex(/[0-9]/, "Tartalmaznia kell legalább egy számot.")
          .regex(/[^a-zA-Z0-9]/, "Tartalmaznia kell legalább egy speciális karaktert."),
     createdAt: z.date(),
     updatedAt: z.date(),
});

export type User = z.infer<typeof UserSchema>;
