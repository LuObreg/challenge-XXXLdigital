import { Router, Request, Response, NextFunction } from "express";
import { z } from "zod";
import DummyController from "../controllers/DummyController.js";
import { Configuration } from "../models/ConfigurationModel.js";

let dummyController: DummyController;

const requestSchema = z.object({
  countryCode: z.string().length(2, { message: "Must be exactly 2 characters long" }),
  uid: z.string()
}).strict();

const validateRequest = (schema: z.ZodObject<any, any, any>) => (req: Request, res: Response, next: NextFunction) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ error: result.error.errors });
  }
  next();
};

const router = (configuration: Configuration): Router => {
  const expressRouter: Router = Router({
    caseSensitive: true,
    strict: true,
  });

  dummyController = new DummyController(configuration);
  expressRouter.post(
    "/validate",
    validateRequest(requestSchema),
    (req: Request, res: Response) => {
      const { countryCode, uid } = req.body;
      try {
        const response = dummyController
        .checkCountryCode(countryCode, uid)
        res.status(200).json(response)
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        res.status(401).json({ message: errorMessage }); // Enviar el mensaje de error en la respuesta
            }
    }
  );

  return expressRouter;
};

export default router;
