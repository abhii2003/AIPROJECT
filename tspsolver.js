class TSPSolver {
    constructor(graphManager) {
        this.graphManager = graphManager;
        this.steps = [];
    }

    solveTSP() {
        if (this.graphManager.nodes.length === 0) {
            alert("Please create a protein graph first.");
            return;
        }

        const algorithm = document.getElementById('algorithm').value;
        const edgeList = this.generateEdgeList();

        this.steps = []; // Reset steps before solving
        let result;
        if (algorithm === 'dp') {
            result = this.solveTSPUsingDP(edgeList);
        } else if (algorithm === 'bnb') {
            result = this.solveTSPUsingBnB(edgeList);
        }

        document.getElementById('solution').innerHTML = 'Optimal Path: ' + result.path.join(' -> ') + '<br>Total Energy: ' + result.energy;
        this.highlightPath(result.path);
        this.fillStepsTable(this.steps); // Update the steps table with recorded steps
    }

    generateEdgeList() {
        const edgeList = {};
        this.graphManager.edges.forEach(edge => {
            if (!edgeList[edge.from]) edgeList[edge.from] = {};
            if (!edgeList[edge.to]) edgeList[edge.to] = {};
            edgeList[edge.from][edge.to] = parseInt(edge.label);
            edgeList[edge.to][edge.from] = parseInt(edge.label);
        });
        return edgeList;
    }
    //using DP

    //using branch and bound 

    solveTSPUsingBnB(edgeList) {
        const n = this.graphManager.nodes.length;
        let bestPath = [];
        let minEnergy = Infinity;

        const dfs = (node, mask, energy, path) => {
            if (mask === (1 << n) - 1) {
                if (energy < minEnergy) {
                    minEnergy = energy;
                    bestPath = [...path];
                    this.steps.push({ step: `Completed path: ${path.join(' -> ')}`, subset: [...path], energy }); // Track completion
                }
                return;
            }

            for (let next = 0; next < n; next++) {
                if (mask & (1 << next)) continue;
                const newEnergy = energy + edgeList[node + 1][next + 1];
                if (newEnergy < minEnergy) {
                    dfs(next, mask | (1 << next), newEnergy, [...path, next + 1]);
                    this.steps.push({ step: `Moving from ${node + 1} to ${next + 1}`, subset: [...path, next + 1], energy: newEnergy }); // Track step
                }
            }
        };

        dfs(0, 1, 0, [1]);
        return { path: bestPath, energy: minEnergy };
    }

    getSubset(mask) {
        const subset = [];
        for (let i = 0; i < this.graphManager.nodes.length; i++) {
            if (mask & (1 << i)) {
                subset.push(i + 1);
            }
        }
        return subset;
    }

    highlightPath(path) {
        // Reset all edge colors to gray
        this.graphManager.edges.forEach(edge => {
            edge.color = { color: 'gray' }; // Reset edge color to gray
        });

        // Highlight the edges that are part of the optimal path
        for (let i = 0; i < path.length - 1; i++) {
            const from = path[i];
            const to = path[i + 1];

            this.graphManager.edges.forEach(edge => {
                if ((edge.from === from && edge.to === to) || (edge.from === to && edge.to === from)) {
                    edge.color = { color: 'red', highlight: 'red' }; // Highlight edge in red
                }
            });
        }

        // Redraw the network to reflect highlights
        this.graphManager.edges.update(this.graphManager.edges.get());
        this.graphManager.network.redraw();
    }

    fillStepsTable(steps) {
        const tableBody = document.getElementById('steps-body');
        tableBody.innerHTML = ''; // Clear previous rows
        steps.forEach((step, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `<td>${index + 1}</td><td>${step.subset.join(', ')}</td><td>${step.energy}</td>`;
            tableBody.appendChild(row);
        });
    }
}
const tspSolver = new TSPSolver(graphManager);
