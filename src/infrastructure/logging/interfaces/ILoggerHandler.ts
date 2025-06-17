
export interface ILoggerHandler {

    /**
     * Log une information importante pour le suivi du bon fonctionnement de l'application.
     * Ce niveau de log est utilisé pour enregistrer les événements normaux du système, 
     * tels que les actions utilisateur ou le statut des processus.
     * 
     * @param message - Le message décrivant l'événement ou l'information à loguer.
     * @param payload - Données supplémentaires associées à l'événement (facultatif).
     */
    info(message: string, payload?: any): void 

    /**
     * Log une erreur critique qui nécessite une attention immédiate.
     * Ce niveau de log est utilisé pour capturer les exceptions ou les défaillances 
     * empêchant le bon fonctionnement de l'application.
     * 
     * @param message - Le message décrivant l'erreur survenue.
     * @param payload - Données supplémentaires associées à l'erreur (facultatif).
     */
    error(message: string, payload?: any): void 

    /**
     * Log un avertissement indiquant un potentiel problème ou une situation anormale.
     * Ce niveau de log est utilisé pour signaler des comportements qui pourraient 
     * entraîner des problèmes, sans interrompre l'application.
     * 
     * @param message - Le message décrivant l'avertissement.
     * @param payload - Données supplémentaires associées à l'avertissement (facultatif).
     */
    warn(message: string, payload?: any): void 

    /**
     * Log des informations détaillées pour diagnostiquer ou déboguer des problèmes.
     * Ce niveau de log est utilisé principalement pendant le développement ou pour 
     * comprendre le comportement précis du système.
     * 
     * @param message - Le message décrivant l'action ou l'état à déboguer.
     * @param payload - Données supplémentaires associées à l'action ou à l'état (facultatif).
     */
    debug(message: string, payload?: any): void

}