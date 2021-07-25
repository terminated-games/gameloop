# GameLoop Controller
 
Controlled environment for developing concurrent, multithreaded, performant & event-based (I/O) game servers using TypeScript.
 
## The general todo list
* Use of SharedArrayBuffer between internal threads with Atomics synchronization.
* Internal and External processes runned by the controller process.
* Dameon to keep running the controllers in the background.
* Monitoring to control the status of running threads and utilization metrics.
* Load balancer, to spawn additional worker_threads on demand.
* Cli to control the daemon start, restart and stop controllers.
* Runtime hooks to run along the shell runtime.
 
This repo is under development - 2021
