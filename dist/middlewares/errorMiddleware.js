"use strict";
// const logErrors = (
//     err: { stack: any },
//     req: any,
//     res: any,
//     next: (arg0: any) => void
// ) => {
//     console.log(err.stack);
//     next(err);
// };
// const clientErrorHandler = (
//     err: any,
//     req: { xhr: any },
//     res: {
//         status: (arg0: number) => {
//             (): any;
//             new (): any;
//             json: { (arg0: { error: string }): void; new (): any };
//         };
//     },
//     next: (arg0: any) => void
// ) => {
//     if (req.xhr) {
//         res.status(500).json({ error: "Client error" });
//     } else {
//         next(err);
//     }
// };
// const errorHandler = (
//     err: any,
//     req: any,
//     res: {
//         status: (arg0: number) => {
//             (): any;
//             new (): any;
//             json: { (arg0: { error: any }): void; new (): any };
//         };
//     },
//     next: any
// ) => {
//     res.status(500);
//     res.status(500).json({ error: err });
// };
// export default { logErrors, clientErrorHandler, errorHandler };
