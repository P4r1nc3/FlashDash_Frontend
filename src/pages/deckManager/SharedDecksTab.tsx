import { motion } from "framer-motion";

const SharedDecksTab = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center items-center py-12"
        >
            <p className="text-gray-500 text-lg">Shared decks feature is not implemented yet.</p>
        </motion.div>
    );
};

export default SharedDecksTab;