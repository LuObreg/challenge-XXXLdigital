import { Router, Request, Response, NextFunction } from "express";
import { z } from "zod";
import UidCheckerController from "../controllers/UidCheckerController.js";
import { Configuration } from "../models/ConfigurationModel.js";
import { errorCatalogue } from "../documents/errorCatalogue.js";

let uidCheckerController: UidCheckerController;

const requestSchema = z.object({
  countryCode: z.string().length(2, { message: "must be exactly 2 characters long. " }),
  uid: z.string()
}).strict();

const validateRequest = (schema: z.ZodObject<any, any, any>) => 
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const errorMessages = result.error.errors
        .map((error) => {
          const field = error.path.join('.');
          return `${field} ${error.message}`;
        })
        .join(' ');
        const errorObj = errorCatalogue.find((entry) => entry.code === 'bad_request') || 
        { statusCode: 400, code: 'bad_request'};

return res.status(errorObj.statusCode).json({
code: errorObj.code,
message: errorMessages,
});    }
    next();
  };


const router = (configuration: Configuration): Router => {
  const expressRouter: Router = Router({
    caseSensitive: true,
    strict: true,
  });

  uidCheckerController = new UidCheckerController(configuration);
  expressRouter.post(
    "/validate",
    validateRequest(requestSchema),
    async (req: Request, res: Response) => {
      const { countryCode, uid } = req.body;
      try {
        const response = await uidCheckerController
        .processCountryCode(countryCode, uid)
        res.status(200).json(response)
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        const errorObj = errorCatalogue.find(entry => entry.code === errorMessage) || { statusCode: 500, message: 'Unknown error' };
        res.status(errorObj?.statusCode).json({ code: errorObj?.statusCode, message: errorObj?.message }); 
            }
    }
  );

  return expressRouter;
};

export default router;
