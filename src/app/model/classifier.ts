export class Classifier {
    id: number;
    name: string;
    description?: string;
    active_from: string;
    train_size: number;
    validation_size: number;
    test_size: number;
    image_width: number;
    image_height: number;
    transfer_train_time: BigInteger;
    transfer_train_accuracy: number;
    transfer_train_loss: number;

    fine_tune_time?: number;
    fine_tune_accuracy? : number;
    fine_tune_loss? : number;

    test_accuracy? : number;
    test_time? : number;
    test_top3_accuracy? : number;
    test_probability? : number;
  
    final_plot?: string;
    transfer_train_plot?: string;
    fine_tune_plot?: string;
}