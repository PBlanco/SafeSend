# SafeSend

A secure file transfer application built with AWS CDK, TypeScript, and React. This project provides a secure way to upload and download files using pre-signed URLs and AWS S3.

## Project Structure

- `/client` - React frontend application built with Vite
- `/lambda` - AWS Lambda functions for handling file operations
- `/lib` - CDK infrastructure code
- `/test` - Test files for the infrastructure and Lambda functions

## Prerequisites

- Node.js (v20 or later)
- AWS CLI configured with appropriate credentials
- npm or yarn package manager

## Setup and Installation

1. Install backend dependencies:
```bash
npm install
```

2. Install frontend dependencies:
```bash
cd client
npm install
```

3. Configure your environment variables:
- Copy `.env.example` to `.env` (if available)
- Set up necessary AWS credentials

## Development Commands

### Backend (CDK)

* `npm run build`   - Compile TypeScript to JavaScript
* `npm run watch`   - Watch for changes and compile
* `npm run test`    - Run Jest unit tests
* `npx cdk deploy`  - Deploy the stack to your AWS account/region
* `npx cdk diff`    - Compare deployed stack with current state
* `npx cdk synth`   - Emit the synthesized CloudFormation template

### Lambda Testing

* `npm run local-upload-lambda`   - Test the upload Lambda function locally
* `npm run local-download-lambda` - Test the download Lambda function locally

### Frontend (Client)

From the `client` directory:

* `npm run dev`     - Start the development server
* `npm run build`   - Build for production
* `npm run preview` - Preview production build locally

## Security

This application implements secure file transfer using AWS pre-signed URLs and S3 bucket policies. All file transfers are encrypted in transit and at rest.

## License

This project is licensed under the GNU Affero General Public License v3.0 (AGPL-3.0). This means:

- ✅ You can use this software freely
- ✅ You can modify and distribute this software
- ✅ You must share any modifications you make if you distribute the software
- ✅ You must share any modifications if you use the software to provide a service over a network
- ❌ You cannot use this code in proprietary/closed-source software
- ❌ You cannot sell this software as a standalone product

See the [LICENSE](LICENSE) file for details.
