<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{

    public function index(){
        $orders =  DB::select(
            'SELECT * FROM orders'
        );

        return response([
            "code" => "201",
            "message" => "all orders successfully indexed",
            "data" => $orders
        ]);
    }

    public function show($id){
        $order =  DB::select(
            'SELECT * FROM orders WHERE (id = ?)', [$id]
        );

        if($order != [])
            return response([
                "code" => "201",
                "message" => "Order successfully showed",
                "data" => $order
            ]);
        else
            return response([
                "code" => "501",
                "message" => "Order not found",
                "data" => null
            ]);
    }


    public function store(Request $request){

        $this->validate($request, [
            "user_id" => "required",
            "payment_type" => "required",
            "total_price" => "required",
            "word" => "required",
            "value" => "required"
        ]);

        $user_id = $request->input('user_id');
        $payment_type = $request->input('payment_type');
        $total_price= $request->input('total_price');

        $word = $request->input('word');
        $value = $request->input('value');

        $is_created = DB::insert('INSERT INTO orders (user_id, payment_type, total_price) VALUES (?, ?, ?)', [$user_id, $payment_type, $total_price]);

        if ($is_created == true){
            $order = DB::select(
                'SELECT * FROM orders
                        WHERE user_id = ? AND payment_type = ? AND total_price = ?
                        ORDER BY created_at DESC OFFSET 0 ROWS FETCH NEXT 1 ROWS ONLY',
                [$user_id, $payment_type, $total_price]);
            $create_meta = DB::insert('INSERT INTO order_meta (order_id, word, value) VALUES (?, ?, ?)', [$order[0]->id, $word, $value]);

            if ($create_meta == true){
                $meta = DB::select('SELECT * FROM order_meta WHERE order_id = ?',[$order[0]->id]);

                return response([
                    "code" => "201",
                    "message" => "Order successfully created",
                    "data" => [
                        'order' => $order,
                        'order_meta' => $meta
                    ]
                ]);
            }
        }
        else
            return response([
                "code" => "501",
                "message" => "Order can't create",
                "data" => null
            ]);
    }

    public function update(Request $request, $id){
        $existingOrder = DB::select('SELECT * FROM orders WHERE (id = ?)', [intval($id) ]);
        $existingMeta = DB::select('SELECT * FROM order_meta WHERE (order_id = ?)', [intval($id) ]);

        if ($existingOrder) {
            $user_id = $request->input('user_id')?? $existingOrder[0]->user_id;
            $payment_type = $request->input('payment_type')?? $existingOrder[0]->payment_type;
            $total_price= $request->input('total_price')?? $existingOrder[0]->total_price;

            $word = $request->input('word')?? $existingMeta[0]->word;
            $value = $request->input('value')?? $existingMeta[0]->value;


            $updateResult = DB::update('UPDATE orders SET user_id = ?, payment_type = ?, total_price = ?  WHERE id = ?', [$user_id, $payment_type, $total_price, $id]);

            if ($updateResult > 0) {
                $update_meta = DB::update('UPDATE order_meta SET word = ?, value = ? WHERE order_id = ?', [$word, $value, $id]);
                if ($update_meta > 0){
                    $updatedOrder = DB::select('SELECT * FROM orders WHERE (id = ?)', [$id]);
                    $meta = DB::select('SELECT * FROM order_meta WHERE (order_id = ?)', [$id]);
                    return response([
                        "code" => "201",
                        "message" => "Order successfully updated",
                        "data" => [
                            'order' => $updatedOrder,
                            'order_meta' => $meta
                        ]
                    ]);
                }
            } else {
                // Update failed
                return response([
                    "code" => "501",
                    "message" => "Order update failed",
                    "data" => null
                ]);
            }
        } else {
            return response([
                "code" => "501",
                "message" => "Order not found",
                "data" => null
            ]);
        }
    }

    public function delete($id){
        $existingOrder = DB::select('SELECT * FROM orders WHERE (id = ?)', [intval($id) ]);

        if ($existingOrder) {
            $deleteResult = DB::delete('DELETE FROM orders WHERE id = ?', [intval($id)]);

            if ($deleteResult > 0) {
                return response([
                    "code" => "200",
                    "message" => "Order successfully deleted",
                    "data" => null
                ]);
            } else {
                return response([
                    "code" => "501",
                    "message" => "Order deletion failed",
                    "data" => $existingOrder[0]
                ]);
            }
        } else {
            return response([
                "code" => "501",
                "message" => "Order not found",
                "data" => null
            ]);
        }
    }




}
