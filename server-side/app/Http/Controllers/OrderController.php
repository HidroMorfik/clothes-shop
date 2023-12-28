<?php

namespace App\Http\Controllers;

use App\Helpers\User;
use http\Exception\InvalidArgumentException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function getOrdersByPaymentType($paymentType)
    {
        $orders = DB::select('EXEC GetOrdersByPaymentType ?', [$paymentType]);
        return response()->json([
            "message" => "successfully indexed",
            "data" => $orders
        ],201);
    }

    public function index(Request $request){
        if (User::isManager($request->header("sess_id"))){
            $orders =  DB::select(
                'SELECT orders.*, users.name as user_name, users.surname as user_surname
                        FROM orders
                        JOIN users ON orders.user_id = users.id'
            );

            return response()->json([
                "message" => "all orders successfully indexed",
                "data" => $orders
            ],201);
        }
        else {
            $orders_by_id = DB::select("
            SELECT * FROM orders
                        WHERE user_id = (SELECT user_id FROM sessions
                                                        WHERE sess_id = ?)", [$request->header("sess_id")]);
            return response()->json([
                "message" => "Orders successfully showed",
                "data" => $orders_by_id
            ],201);
        }
    }

    public function show(Request $request, $id){
        $order =  DB::select(
            'SELECT * FROM orders WHERE (id = ?)', [$id]
        );

        if($order != [])
            if (User::isManager($request->header("sess_id"))){
                return response()->json([
                    "message" => "Order successfully showed",
                    "data" => $order
                ],201);
            }
            else{
                $auth_user_id = DB::select("SELECT user_id FROM sessions WHERE sess_id = ? ", [$request->header("sess_id")]);

                if ($auth_user_id[0]->user_id == $order[0]->user_id){
                    return response()->json([
                        "message" => "Order successfully showed",
                        "data" => $order
                    ],201);
                }
                else
                    return response()->json([
                        "message" => "Yetkisiz İslem"
                    ],403);
            }
        else
            return response()->json([
                "message" => "Order not found",
                "data" => null
            ],401);

    }


    public function store(Request $request){

        $this->validate($request, [
            "user_id" => "required",
            "payment_type" => "required",
            "total_price" => "required",
        ]);

        $user_id = $request->input('user_id');
        $payment_type = $request->input('payment_type');
        $total_price= $request->input('total_price');

        $product_info = $request->input('product_info');
        $address = $request->input('address');

        $is_created = DB::insert('INSERT INTO orders (user_id, payment_type, total_price) VALUES (?, ?, ?)', [$user_id, $payment_type, $total_price]);

        if ($is_created == true){
            $order = DB::select(
                'SELECT * FROM orders
                        WHERE user_id = ? AND payment_type = ? AND total_price = ?
                        ORDER BY created_at DESC OFFSET 0 ROWS FETCH NEXT 1 ROWS ONLY',
                [$user_id, $payment_type, $total_price]);
//            $update_meta = DB::update('UPDATE order_meta SET product_info = ?, address = ? WHERE order_id = ?', [$product_info, $address , $order[0]->id]);

            if ($is_created == true){
//                $meta = DB::select('SELECT * FROM order_meta WHERE order_id = ?',[$order[0]->id]);

                return response([
                    "code" => "201",
                    "message" => "Order successfully created",
                    "data" => [
                        'order' => $order,
                        'order_meta' => ""
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

            $product_info = $request->input('product_info')?? $existingMeta[0]->word;
            $address = $request->input('address')?? $existingMeta[0]->value;


            $updateResult = DB::update('UPDATE orders SET user_id = ?, payment_type = ?, total_price = ?  WHERE id = ?', [$user_id, $payment_type, $total_price, $id]);

            if ($updateResult > 0) {
                $update_meta = DB::update('UPDATE order_meta SET product_info = ?, address = ? WHERE order_id = ?', [$product_info, $address, $id]);
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




