class GraphManager {
    constructor(containerId) {
        this.nodes = new vis.DataSet([]);
        this.edges = new vis.DataSet([]);
        this.network = null;
        this.container = document.getElementById(containerId);
    }

    createProteinGraph() {
        const sequence = document.getElementById('sequence').value.toUpperCase();
        if (!sequence.match(/^[HP]+$/)) {
            alert("Invalid sequence. Please use only H (hydrophobic) and P (polar) amino acids.");
            return;
        }

        this.nodes.clear();
        this.edges.clear();

        for (let i = 0; i < sequence.length; i++) {
            this.nodes.add({ id: i + 1, label: sequence[i], title: `Amino Acid ${i + 1}: ${sequence[i]}` });
        }

        for (let i = 0; i < sequence.length; i++) {
            for (let j = i + 1; j < sequence.length; j++) {
                const weight = (sequence[i] === 'H' && sequence[j] === 'H') ? -1 : 0;
                this.edges.add({ from: i + 1, to: j + 1, label: weight.toString(), color: { color: 'gray' } });
            }
        }

        const data = { nodes: this.nodes, edges: this.edges };
        const options = {
            nodes: {
                shape: 'circle',
                size: 20,
                font: { size: 16 }
            },
            edges: {
                font: { size: 12 }
            },
            physics: true
        };

        this.network = new vis.Network(this.container, data, options);
    }
}
const graphManager = new GraphManager('graph-container');