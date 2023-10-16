<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('document_share_link_emails', function (Blueprint $table) {
            $table->id();
            $table->string('share_id');
            $table->unsignedBigInteger('share_document_id');
            $table->string('share_email');
            $table->integer('status')->comment('1=active, 2=inactive/delete');
            $table->unsignedBigInteger('shared_by');
            $table->timestamps();
            $table->foreign('shared_by')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('share_document_id')->references('id')->on('voucher_documents')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('document_share_link_emails');
    }
};
