type Listener = (sel: number[]) => void;

declare global {
    var selectionInstance: Selection;
}

class Selection {
    private static instance?: Selection;
    static getInstance() {
        if (process.env.NODE_ENV === "production") {
            if (!this.instance) {
                this.instance = new Selection();
            }

            return this.instance;
        } else {
            if (!global.selectionInstance) {
                global.selectionInstance = new Selection();
            }

            return global.selectionInstance;
        }
    }

    private selection: number[] = [];
    private listeners: Set<Listener> = new Set();

    public set(sel: number[]) {
        this.selection = sel;

        this.listeners.forEach((l) => l(sel));
    }
    public get() {
        return this.selection;
    }
    public on(l: Listener) {
        this.listeners.add(l);

        l(this.selection);
    }
    public off(l: Listener) {
        this.listeners.delete(l);
    }
}

export default Selection;
