import { z } from 'zod'



//CreateBundle validation schema
const createBundleSchema = z.object({
  Bundle_id: z.string().min(1, "Bundle ID is required"),
  Data: z.string().min(1, "Data is required"),
  name: z.string().min(1, "Name is required"),
 JBCP: z.coerce.number({ invalid_type_error: "JBCP must be a valid number" }).positive("JBCP must be greater than 0"),
JBSP: z.coerce.number({ invalid_type_error: "JBSP must be a valid number" }).positive("JBSP must be greater than 0"),
  network: z.string().min(1, "Network is required"),
  Duration: z.string().min(1, "Duration is required"),
  size: z.string().optional(),
  recommendedRange: z.string().optional(),
}).refine(data => data.JBSP >= data.JBCP, {
  message: "Selling price cannot be less than cost price",
  path: ["JBSP"]
})

export const validateCreateBundle = (data) => {
  return createBundleSchema.parse(data) // throws automatically if invalid
}